using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;


    public static class JString
    {
        private static Random random = new Random();


        public static string[][] ToTwoDimArray(this string source, char separatorOuter = ';', char separatorInner = ',')
        {
            return source
                   .Split(separatorOuter)
                   .Select(x => x.Split(separatorInner))
                   .ToArray();
        }


        public static string RemoveLast(this string text, string character)
        {
            if (text.Length < 1) return text;
            return text.Remove(text.ToString().LastIndexOf(character), character.Length);
        }


        public static bool isMobileBrowser()
        {
            //GETS THE CURRENT USER CONTEXT    
            HttpContext context = HttpContext.Current;

            //FIRST TRY BUILT IN ASP.NT CHECK    
            if (context.Request.Browser.IsMobileDevice)
            {
                return true;
            }
            //THEN TRY CHECKING FOR THE HTTP_X_WAP_PROFILE HEADER    
            if (context.Request.ServerVariables["HTTP_X_WAP_PROFILE"] != null)
            {
                return true;
            }
            //THEN TRY CHECKING THAT HTTP_ACCEPT EXISTS AND CONTAINS WAP    
            if (context.Request.ServerVariables["HTTP_ACCEPT"] != null &&
                context.Request.ServerVariables["HTTP_ACCEPT"].ToLower().Contains("wap"))
            {
                return true;
            }
            //AND FINALLY CHECK THE HTTP_USER_AGENT     
            //HEADER VARIABLE FOR ANY ONE OF THE FOLLOWING    
            if (context.Request.ServerVariables["HTTP_USER_AGENT"] != null)
            {
                //Create a list of all mobile types    
                string[] mobiles =
                    new[]
                {
            "midp", "j2me", "avant", "docomo",
            "novarra", "palmos", "palmsource",
            "240x320", "opwv", "chtml",
            "pda", "windows ce", "mmp/",
            "blackberry", "mib/", "symbian",
            "wireless", "nokia", "hand", "mobi",
            "phone", "cdm", "up.b", "audio",
            "SIE-", "SEC-", "samsung", "HTC",
            "mot-", "mitsu", "sagem", "sony"
            , "alcatel", "lg", "eric", "vx",
            "NEC", "philips", "mmm", "xx",
            "panasonic", "sharp", "wap", "sch",
            "rover", "pocket", "benq", "java",
            "pt", "pg", "vox", "amoi",
            "bird", "compal", "kg", "voda",
            "sany", "kdd", "dbt", "sendo",
            "sgh", "gradi", "jb", "dddi",
            "moto", "iphone"
                };

                //Loop through each item in the list created above     
                //and check if the header contains that text    
                foreach (string s in mobiles)
                {
                    if (context.Request.ServerVariables["HTTP_USER_AGENT"].
                                                        ToLower().Contains(s.ToLower()))
                    {
                        return true;
                    }
                }
            }

            return false;
        }


        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }


        public static string RandomChart(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }




        private static readonly string[] VietnameseSigns = new string[]
            {
            "aAeEoOuUiIdDyY",
            "áàạảãâấầậẩẫăắằặẳẵ",
            "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",
            "éèẹẻẽêếềệểễ",
            "ÉÈẸẺẼÊẾỀỆỂỄ",
            "óòọỏõôốồộổỗơớờợởỡ",
            "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",
            "úùụủũưứừựửữ",
            "ÚÙỤỦŨƯỨỪỰỬỮ",
            "íìịỉĩ",
            "ÍÌỊỈĨ",
            "đ",
            "Đ",
            "ýỳỵỷỹ",
            "ÝỲỴỶỸ"
            };

        public static string RemoveSign4VietnameseString(string str)
        {
            // Tiến hành thay thế, lọc bỏ dấu cho chuỗi
            for (int i = 1; i < VietnameseSigns.Length; i++)
            {
                for (int j = 0; j < VietnameseSigns[i].Length; j++)
                    str = str.Replace(VietnameseSigns[i][j], VietnameseSigns[0][i - 1]);
            }

            str = str.Trim();
            str = str.Replace(" ", "-");
            str = str.Replace(",", "-");
            str = str.Replace(":", "-");
            str = str.Replace(".", "-");
            str = str.Replace("/", "-");
            str = str.Replace(";", "-");
            str = str.Replace("&", "-");
            str = str.Replace("%", "-");
            str = str.Replace("+", "-");
            str = str.Replace("(", "-");
            str = str.Replace(")", "-");
            str = str.Replace("{", "-");
            str = str.Replace("}", "-");
            str = str.Replace("[", "-");
            str = str.Replace("]", "-");
            str = str.Replace("--", "-");
            str = str.Replace("\"", "");

            str = str.ToLower();

            return str;
        }


        public static string ConvertCurrencyVND(double? price, bool symbols)
        {
            string sPrice;
            if (price != null)
            {
                sPrice = string.Format("{0:C}", price).Remove(0, 1).ToString().Replace(",", ".");

                if (symbols == true)
                {
                    sPrice = sPrice.Remove(sPrice.Length - 3, 3) + " ₫";
                }
                else
                {
                    sPrice = sPrice.Remove(sPrice.Length - 3, 3);
                }
            }
            else
            {
                sPrice = "Liên hệ";
            }

            return sPrice;
        }


        public static string ConvertCurrencyVND(double? price, string symbols)
        {
            string sPrice;
            if (price != null)
            {
                sPrice = string.Format("{0:C}", price).Remove(0, 1).ToString().Replace(",", ".");

                if (symbols == null)
                {
                    sPrice = sPrice.Remove(sPrice.Length - 3, 3) + " ₫";
                }
                else
                {
                    sPrice = sPrice.Remove(sPrice.Length - 3, 3) + "" + symbols;
                }
            }
            else
            {
                sPrice = "Liên hệ";
            }

            return sPrice;
        }



        public static string WebP(int dataId, string srcImage)
        {
            string imageUrl = "/uploads/products/" + dataId + "/thumbs/" + srcImage;

            imageUrl = Path.ChangeExtension(imageUrl, ".webp");

            return imageUrl;
        }


        public static string WebPMobile(int dataId, string srcImage)
        {
            string imageUrl = "";

            srcImage = Path.GetFileNameWithoutExtension(srcImage);
            srcImage = srcImage + "-mobile.webp";
            imageUrl = "/uploads/products/" + dataId + "/thumbs/" + srcImage;

            return imageUrl;
        }


        public static string HtmlToPlainText(string html, int take, bool more)
        {
            if (html == null)
            {
                return "...";
            }

            const string tagWhiteSpace = @"(>|$)(\W|\n|\r)+<";//matches one or more (white space or line breaks) between '>' and '<'
            const string stripFormatting = @"<[^>]*(>|$)";//match any character between '<' and '>', even when end tag is missing
            const string lineBreak = @"<(br|BR)\s{0,1}\/{0,1}>";//matches: <br>,<br/>,<br />,<BR>,<BR/>,<BR />
            var lineBreakRegex = new Regex(lineBreak, RegexOptions.Multiline);
            var stripFormattingRegex = new Regex(stripFormatting, RegexOptions.Multiline);
            var tagWhiteSpaceRegex = new Regex(tagWhiteSpace, RegexOptions.Multiline);

            var text = html;
            //Decode html specific characters
            text = System.Net.WebUtility.HtmlDecode(text);
            //Remove tag whitespace/line breaks
            text = tagWhiteSpaceRegex.Replace(text, "><");
            //Replace <br /> with line breaks
            text = lineBreakRegex.Replace(text, Environment.NewLine);
            //Strip formatting
            text = stripFormattingRegex.Replace(text, " ");
            text = text.Replace(">", " ");

            if (take != 0)
            {
                text = string.Join(" ", text.Split().Take(take));

                if (more == false)
                {
                    text = text + "";
                }
                else
                {
                    text = text + "...";
                }
            }

            return text;
        }


        static public string ReplaceInsensitive(this String str, String from, String to)
        {
            str = Regex.Replace(str, from, to, RegexOptions.IgnoreCase);
            return str;
        }

        public static Double? KRound(this Double num)
        {
            if (num < 1000)
            {
                return num;
            }

            return num - (num % 1000);
        }

        public static String ToAscii(this String s)
        {
            if (s == null) return "";

            String[][] symbols = {
                                 new String[] { "[áàảãạăắằẳẵặâấầẩẫậ]", "a" },
                                 new String[] { "[đ]", "d" },
                                 new String[] { "[éèẻẽẹêếềểễệ]", "e" },
                                 new String[] { "[íìỉĩị]", "i" },
                                 new String[] { "[óòỏõọôốồổỗộơớờởỡợ]", "o" },
                                 new String[] { "[úùủũụưứừửữự]", "u" },
                                 new String[] { "[ýỳỷỹỵ]", "y" },
                                 new String[] { "[&+?.,)(]", "-" },
                                 new String[] { "[\\s'\" ]", "-" },
                                 new String[] { "-{2,10}", "-" }
                             };
            s = s.ToLower();
            foreach (var ss in symbols)
            {
                s = Regex.Replace(s, ss[0], ss[1]);
            }
            return s;
        }
        public static bool Contains(this string source, string toCheck, StringComparison comp)
        {
            return source.IndexOf(toCheck, comp) >= 0;
        }

        public static String HighlightKeywords(this String input, String keywords)
        {
            if (input == string.Empty || keywords == string.Empty)
            {
                return input;
            }

            string[] sKeywords = keywords.Split(' ');
            foreach (string sKeyword in sKeywords)
            {
                try
                {
                    input = Regex.Replace(input, sKeyword, string.Format("<span class=\"highlighted\">{0}</span>", "$0"), RegexOptions.IgnoreCase);
                }
                catch
                {
                    //
                }
            }
            return input;
        }



        /// <summary>
        /// Remove HTML from string with Regex.
        /// </summary>
        public static string StripTagsRegex(this string source)
        {
            return Regex.Replace(source, "<.*?>", string.Empty);
        }

        public static string Remove_Html_Tags(this string Html)
        {
            string Only_Text = Regex.Replace(Html, @"<(.|\n)*?>", string.Empty);
            return Only_Text;
        }

        public static string LimitLength(this string orgText, int maxLength, string append)
        {
            if (orgText == null) return null;
            if (orgText.Length <= maxLength) return orgText;
            orgText = HttpContext.Current.Server.HtmlDecode(orgText);
            var words = orgText.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
            var sb = new StringBuilder();
            foreach (var word in words)
            {
                if ((sb + word).Length > maxLength)
                    return string.Format("{0}{1}", sb.ToString().TrimEnd(' '), append);
                sb.Append(word + " ");
            }
            return string.Format("{0}{1}", sb.ToString().TrimEnd(' '), append);

            //return string.Format("{0}{1}", orgText.Substring(0, maxLength), append);
        }

        public static string ResolveServerUrl(this string serverUrl, long productId, bool forceHttps = false)
        {
            if (serverUrl.IndexOf("://") > -1)
                return serverUrl;

            string newUrl = serverUrl;
            Uri originalUri = System.Web.HttpContext.Current.Request.Url;
            newUrl = (forceHttps ? "https" : originalUri.Scheme) +
                "://" + originalUri.Authority + "/Uploads/Products/" + productId + "/Gallery/" + newUrl;
            return newUrl;
        }


        public static string GeneratePassword()
        {
            //Since I'm big on security, I wanted to generate passwords that contained numbers, letters and special
            //characters - and not easily hacked.

            //I started with creating three string variables.
            //This one tells you how many characters the string will contain.
            string PasswordLength = "12";
            //This one, is empty for now - but will ultimately hold the finised randomly generated password
            string NewPassword = "";

            //This one tells you which characters are allowed in this new password
            string allowedChars = "";
            allowedChars = "1,2,3,4,5,6,7,8,9,0";
            allowedChars += "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,";
            allowedChars += "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,";
            allowedChars += "~,!,@,#,$,%,^,&,*,+,?";

            //Then working with an array...

            char[] sep = { ',' };
            string[] arr = allowedChars.Split(sep);

            string IDString = "";
            string temp = "";

            //utilize the "random" class
            Random rand = new Random();

            //and lastly - loop through the generation process...
            for (int i = 0; i < Convert.ToInt32(PasswordLength); i++)
            {
                temp = arr[rand.Next(0, arr.Length)];
                IDString += temp;
                NewPassword = IDString;

                //For Testing purposes, I used a label on the front end to show me the generated password.
                //lblProduct.Text = IDString;
            }

            return NewPassword;
        }
    }

