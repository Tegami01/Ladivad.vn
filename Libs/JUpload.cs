using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Libs
{
    public class JUpload
    {
        public static bool isValidContentLength(int contentLength)
        {
            return (contentLength / 1024) / 1024 < 4;   // 1.5MB
        }


        public static bool isValidContentType(string contentType)
        {
            return contentType.Equals("image/png") || contentType.Equals("image/gif") || contentType.Equals("image/jpg") || contentType.Equals("image/jpeg");
        }


        public static bool SaveUploadFile(HttpPostedFileBase file, int imageId, string forTable, int width, int height)
        {
            if (file != null && file.ContentLength > 0 && isValidContentType(file.ContentType))
            {
                if (!JUpload.isValidContentLength(file.ContentLength))
                {
                    return false;       // Upload không thành công
                }

                string fileName = Path.GetFileName("id" + imageId.ToString() + "-" + file.FileName);
                string filepath = Path.Combine(HttpContext.Current.Server.MapPath("~/uploads/" + forTable), fileName);
                file.SaveAs(filepath);

                // Thumbs
                var pathThumb = Path.Combine(HttpContext.Current.Server.MapPath("~/uploads/" + forTable + "/thumbs"), fileName);
                SaveCroppedImage(Image.FromStream(file.InputStream), width, height, pathThumb);

                // Thumbs 128x128
                var pathThumb128 = Path.Combine(HttpContext.Current.Server.MapPath("~/uploads/" + forTable + "/thumbs/128x128"), fileName);
                SaveCroppedImage(Image.FromStream(file.InputStream), 128, 128, pathThumb128);

                var pathThumb650 = Path.Combine(HttpContext.Current.Server.MapPath("~/uploads/" + forTable + "/thumbs/650x400"), fileName);
                SaveCroppedImage(Image.FromStream(file.InputStream), 650, 400, pathThumb650);

                return true;
            }

            return false;
        }


        public static bool SaveCroppedImage(Image image, int maxWidth, int maxHeight, string filePath)
        {
            ImageCodecInfo jpgInfo = ImageCodecInfo.GetImageEncoders()
                                     .Where(codecInfo =>
                                     codecInfo.MimeType == "image/jpeg").First();
            System.Drawing.Image finalImage = image;
            System.Drawing.Bitmap bitmap = null;
            try
            {
                int left = 0;
                int top = 0;
                int srcWidth = maxWidth;
                int srcHeight = maxHeight;
                bitmap = new System.Drawing.Bitmap(maxWidth, maxHeight);
                double croppedHeightToWidth = (double)maxHeight / maxWidth;
                double croppedWidthToHeight = (double)maxWidth / maxHeight;

                if (image.Width > image.Height)
                {
                    srcWidth = (int)(Math.Round(image.Height * croppedWidthToHeight));
                    if (srcWidth < image.Width)
                    {
                        srcHeight = image.Height;
                        left = (image.Width - srcWidth) / 2;
                    }
                    else
                    {
                        srcHeight = (int)Math.Round(image.Height * ((double)image.Width / srcWidth));
                        srcWidth = image.Width;
                        top = (image.Height - srcHeight) / 2;
                    }
                }
                else
                {
                    srcHeight = (int)(Math.Round(image.Width * croppedHeightToWidth));
                    if (srcHeight < image.Height)
                    {
                        srcWidth = image.Width;
                        top = (image.Height - srcHeight) / 2;
                    }
                    else
                    {
                        srcWidth = (int)Math.Round(image.Width * ((double)image.Height / srcHeight));
                        srcHeight = image.Height;
                        left = (image.Width - srcWidth) / 2;
                    }
                }
                using (Graphics g = Graphics.FromImage(bitmap))
                {
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.CompositingQuality = CompositingQuality.HighQuality;
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.DrawImage(image, new Rectangle(0, 0, bitmap.Width, bitmap.Height),
                    new Rectangle(left, top, srcWidth, srcHeight), GraphicsUnit.Pixel);
                }
                finalImage = bitmap;
            }
            catch { }
            try
            {
                using (EncoderParameters encParams = new EncoderParameters(1))
                {
                    encParams.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, (long)100);
                    //quality should be in the range 
                    //[0..100] .. 100 for max, 0 for min (0 best compression)
                    finalImage.Save(filePath, jpgInfo, encParams);
                    return true;
                }
            }
            catch { }
            if (bitmap != null)
            {
                bitmap.Dispose();
            }
            return false;
        }

    }
}
