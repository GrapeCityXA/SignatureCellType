using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Plugin;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Imaging;

namespace SignatureCellType
{
    [SupportUsingScope(PageScope.AllPage, ListViewScope.None)]
    [Icon("pack://application:,,,/SignatureCellType;component/Resources/icon.png")]
    public class SignatureCellType : CellType, IExportCellType
    {
        public SignatureCellType()
        {
            LineMinWidth = 0.5;
            LineMaxWidth = 1.5;
            DotSize = 1;
        }

        [ResourcesCategoryHeader("SignatureCellType_Options")]
        [ResourcesDisplayName("SignatureCellType_DotSize")]
        [ResourcesDescription("SignatureCellType_DotSize_Description")]
        [OrderWeight(0)]
        [DefaultValue(1)]
        public double DotSize
        {
            get;
            set;
        }

        [ResourcesDisplayName("SignatureCellType_LineMinWidth")]
        [ResourcesDescription("SignatureCellType_LineMinWidth_Description")]
        [OrderWeight(1)]
        [DefaultValue(0.5)]
        public double LineMinWidth
        {
            get;
            set;
        }

        [ResourcesDisplayName("SignatureCellType_LineMaxWidth")]
        [ResourcesDescription("SignatureCellType_LineMaxWidth_Description")]
        [OrderWeight(2)]
        [DefaultValue(1.5)]
        public double LineMaxWidth
        {
            get;
            set;
        }
        
        [ResourcesCategoryHeader("SignatureCellType_Others")]
        [ResourcesDisplayName("SignatureCellType_IsDisabled")]
        [OrderWeight(4)]
        public bool IsDisabled
        {
            get;
            set;
        }

        #region RunTime Resources

        [Browsable(false)]
        public string ClearButtonText
        {
            get
            {
                return Resource.SignatureCellType_Page_ClearButtonText;
            }
        }
        
        #endregion
        public override string ToString()
        {
            return Resource.SignatureCellType_DisplayName;
        }

        public override FrameworkElement GetDrawingControl(ICellInfo cellInfo, IDrawingHelper drawingHelper)
        {
            StackPanel stackPanel = new StackPanel();

            TextBlock textBlock = new TextBlock();
            textBlock.Text = "Sign Here...";
            textBlock.FontFamily = new System.Windows.Media.FontFamily("Comic Sans MS");
            textBlock.FontSize = 16;
            textBlock.HorizontalAlignment = HorizontalAlignment.Center;
            textBlock.VerticalAlignment = VerticalAlignment.Center;
            if (!object.Equals(cellInfo.Foreground, null))
            {
                textBlock.Foreground = cellInfo.Foreground;
            }

            stackPanel.Children.Add(textBlock);
            stackPanel.VerticalAlignment = VerticalAlignment.Center;

            return stackPanel;
        }

        #region IExportCellType
        public bool ExportPicture
        {
            get
            {
                return true;
            }
        }

        public ExportResultInfo ExportToExcel(ICellInfo targetCell, IExportContext context)
        {
            var value = targetCell.Value as string;
            if (string.IsNullOrEmpty(value))
            {
                return null;
            }
            var byteArray = Convert.FromBase64String(value.Substring(context.ExportImageContext.BASE64STRINGHEAD.Length));
            var bitmapImageSource = context.GetPictureByByteArray(byteArray, context.PictureSize.Width, context.PictureSize.Height);

            return new ExportResultInfo()
            {
                ExportValue = null,
                ExportPicture = bitmapImageSource
            };
        }

        #endregion
    }

    public class ResourcesCategoryHeaderAttribute : CategoryHeaderAttribute
    {
        public ResourcesCategoryHeaderAttribute(string categoryHeader) 
            : base(categoryHeader)
        {
        }

        public override string CategoryHeader
        {
            get
            {
                return Resource.ResourceManager.GetString(base.CategoryHeader);
            }
        }
    }

    public class ResourcesDisplayNameAttribute : DisplayNameAttribute
    {
        public ResourcesDisplayNameAttribute(string displayName)
            :base(displayName)
        {

        }
        public override string DisplayName
        {
            get
            {
                return Resource.ResourceManager.GetString(base.DisplayName);
            }
        }
    }

    public class ResourcesDescriptionAttribute : DescriptionAttribute
    {
        public ResourcesDescriptionAttribute(string description)
            : base(description)
        {

        }
        public override string Description
        {
            get
            {
                return Resource.ResourceManager.GetString(base.Description);
            }
        }
    }
}
