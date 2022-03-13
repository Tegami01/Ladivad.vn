using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


    public static class JDateTime
    {
        public static string BlogDate(DateTime dt)
        {
            var thang = Month(dt);
            var ngay = Day(dt);
            var nam = dt.Year.ToString();

            return ngay + " " + thang + " năm " + nam;
        }

        public static string BlogDateV2(DateTime dt)
        {
            var thang = Month(dt);
            var ngay = Day(dt);
            var nam = dt.Year.ToString();

            return ngay + " " + thang + " " + nam;
        }


        public static string NgayThangOnly(DateTime dt)
        {
            var thang = dt.Month.ToString();
            var ngay = dt.Day.ToString();
            var nam = dt.Year.ToString();

            if (ngay.Length == 1)
            {
                ngay = "0" + ngay;
            }

            if (thang.Length == 1)
            {
                thang = "0" + thang;
            }

            return ngay + "/" + thang + "/" + nam;
        }


        public static string GetTimeDefault(DateTime dt)
        {
            return dt.Hour.ToString() + ":" + dt.Minute.ToString() + ":" + dt.Second.ToString();
        }


        public static string GetHours(DateTime dt)
        {

            return dt.Hour.ToString() + ":" + dt.Minute.ToString();
        }


        public static string Month(DateTime dt)
        {
            var month = dt.Month.ToString();

            switch (month)
            {
                case "1":
                    return "Th1";
                case "2":
                    return "Th2";
                case "3":
                    return "Th3";
                case "4":
                    return "Th4";
                case "5":
                    return "Th5";
                case "6":
                    return "Th6";
                case "7":
                    return "Th7";
                case "8":
                    return "Th8";
                case "9":
                    return "Th9";
                case "10":
                    return "Th10";
                case "11":
                    return "Th11";
                case "12":
                    return "Th12";
                default:
                    break;
            }

            return month;
        }


        public static string Day(DateTime dt)
        {
            var day = dt.Day.ToString();

            switch (day)
            {
                case "1":
                    return "01";
                case "2":
                    return "02";
                case "3":
                    return "03";
                case "4":
                    return "04";
                case "5":
                    return "05";
                case "6":
                    return "06";
                case "7":
                    return "07";
                case "8":
                    return "08";
                case "9":
                    return "09";
                default:
                    break;
            }

            return day;
        }


        public static string TimeAgo(DateTime dt)
        {
            TimeSpan span = DateTime.Now - dt;
            if (span.Days > 365)
            {
                int years = (span.Days / 365);
                if (span.Days % 365 != 0)
                    years += 1;
                return String.Format("Khoảng {0} {1} trước",
                years, years == 1 ? "năm" : "năm");
            }
            if (span.Days > 30)
            {
                int months = (span.Days / 30);
                if (span.Days % 31 != 0)
                    months += 1;
                return String.Format("Khoảng {0} {1} trước",
                months, months == 1 ? "tháng" : "tháng");
            }
            if (span.Days > 0)
                return String.Format("Khoảng {0} {1} trước",
                span.Days, span.Days == 1 ? "ngày" : "ngày");
            if (span.Hours > 0)
                return String.Format("Khoảng {0} {1} trước",
                span.Hours, span.Hours == 1 ? "giờ" : "giờ");
            if (span.Minutes > 0)
                return String.Format("Khoảng {0} {1} trước",
                span.Minutes, span.Minutes == 1 ? "phút" : "phút");
            if (span.Seconds > 5)
                return String.Format("Khoảng {0} giây trước", span.Seconds);
            if (span.Seconds <= 5)
                return "just now";
            return string.Empty;
        }
    }