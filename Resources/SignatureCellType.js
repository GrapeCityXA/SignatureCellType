var SignatureCellType = (function (_super) {
    __extends(SignatureCellType, _super);
    function SignatureCellType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }

    SignatureCellType.prototype.signaturePad = null;
    SignatureCellType.prototype.clearButton = null;
    SignatureCellType.prototype.onDocumentClick = null;
    SignatureCellType.prototype.canvas = null;

    SignatureCellType.prototype.createContent = function () {
        var self = this;

        var element = this.CellElement;
        var cellTypeMetaData = element.CellType;
        var container = $("<div id='" + this.ID + "'></div>");

        var clearButtonHeight = this.measureButtonHeight(cellTypeMetaData.ClearButtonText);

        var canvasDiv = $("<div></div>");
        canvasDiv.css("position", "absolute");
        canvasDiv.css("left", "0px");
        canvasDiv.css("top", "0px");
        canvasDiv.css("right", "0px");
        canvasDiv.css("bottom", clearButtonHeight + "px");
        canvasDiv.css("border", "1px solid #D4D4D4");
        canvasDiv.css("user-select", "none");

        var canvas = $("<canvas style='touch-action: none;'></canvas>");
        canvas[0].width = element.Width;
        canvas[0].height = element.Height - clearButtonHeight;
        this.canvas = canvas;

        canvasDiv.append(canvas);

        this.signaturePad = new SignaturePad(canvas[0]);

        var options = this.getOptions(cellTypeMetaData, element.StyleInfo);
        this.signaturePad.dotSize = options.dotSize;
        this.signaturePad.minWidth = options.minWidth;
        this.signaturePad.maxWidth = options.maxWidth;
        this.signaturePad.penColor = options.penColor;

        var footerDiv = $("<div></div>");
        footerDiv.css("position", "absolute");
        footerDiv.css("left", "0px");
        footerDiv.css("right", "0px");
        footerDiv.css("bottom", "0px");
        footerDiv.css("height", clearButtonHeight + "px");
        footerDiv.css("background", "white");

        this.clearButton = this.getClearButton(cellTypeMetaData.ClearButtonText);
        this.clearButton.on("click", function () {
            self.signaturePad.clear();
            self.commitValue();
        });
        footerDiv.append(this.clearButton);

        container.append(canvasDiv);
        container.append(footerDiv);

        if (cellTypeMetaData.IsDisabled === true) {
            this.disable();
        }

        this.onDocumentClick = function (e) {
            var mousePoint = self.getMousePosition(e || window.event);

            var offset = canvas.offset();
            var w = canvas.width();
            var h = canvas.height();
            if (mousePoint.y < offset.top || mousePoint.y > offset.top + h ||
                mousePoint.x < offset.left || mousePoint.x > offset.left + w) {
                self.commitValue();
            }
        };
        $(document).on("mousedown", this.onDocumentClick);
        return container;
    }

    SignatureCellType.prototype.getMousePosition = function (ev) {
        if (ev.pageX || ev.pageY) {
            return { x: ev.pageX, y: ev.pageY };
        }
        return {
            x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: ev.clientY + document.body.scrollTop - document.body.clientTop
        };
    }

    SignatureCellType.prototype.getClearButton = function (clearButtonText) {
        var clearButton = $("<button type='button' class='button clear' data-action='clear'>" + clearButtonText + "</button>");
        clearButton.css("margin-top", "5px");

        var fontFamily = "";
        if (this.CellElement.StyleInfo && this.CellElement.StyleInfo.FontFamily) {
            fontFamily = this.CellElement.StyleInfo.FontFamily;
        }
        clearButton.css("font-family", fontFamily);
        clearButton.css("font-size", "14px");

        return clearButton;
    }

    SignatureCellType.prototype.measureButtonHeight = function (clearButtonText) {
        var clearButton = this.getClearButton(clearButtonText);
        clearButton.css("opacity", 0);
        $(window.document.body).append(clearButton);

        var height = clearButton.outerHeight(true);
        clearButton.remove();

        return height;
    }

    SignatureCellType.prototype.destroy = function () {
        $(document).off("mousedown", this.onDocumentClick);
    }

    SignatureCellType.prototype.getOptions = function (cellTypeMetaData, styleInfo) {
        var dotSize = 1;
        if (cellTypeMetaData.DotSize > 0) {
            dotSize = cellTypeMetaData.DotSize;
        }

        var minWidth = 0.5;
        if (cellTypeMetaData.LineMinWidth > 0) {
            minWidth = cellTypeMetaData.LineMinWidth;
        }

        var maxWidth = 1.5;
        if (cellTypeMetaData.LineMaxWidth > 0) {
            maxWidth = cellTypeMetaData.LineMaxWidth;
        }

        var penColor = "black";
        if (styleInfo && styleInfo.Foreground && styleInfo.Foreground !== "") {
            penColor = styleInfo.Foreground;
        }

        return {
            dotSize: dotSize,
            minWidth: minWidth,
            maxWidth: maxWidth,
            penColor: penColor
        };
    }

    SignatureCellType.prototype.getValueFromElement = function () {
        if (this.signaturePad.isEmpty()) {
            return null;
        }
        return this.signaturePad.toDataURL();
    }

    SignatureCellType.prototype.setValueToElement = function (element, value) {
        this.signaturePad.clear();
        this.signaturePad.fromDataURL(value);
        this.signaturePad._isEmpty = value == null ? true : false;
    }

    SignatureCellType.prototype.disable = function () {
        _super.prototype.disable.call(this);
        this.signaturePad.off();
        this.clearButton.css("display", "none");
    }

    SignatureCellType.prototype.enable = function () {
        _super.prototype.enable.call(this);
        this.signaturePad.on();
        this.clearButton.css("display", "");
    }

    return SignatureCellType;
}(Forguncy.CellTypeBase));

Forguncy.CellTypeHelper.registerCellType("SignatureCellType.SignatureCellType, SignatureCellType", SignatureCellType);