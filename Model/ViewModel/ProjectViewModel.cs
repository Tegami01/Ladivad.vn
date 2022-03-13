using Model.DataModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Model.ViewModel
{
    public class ProjectViewModel
    {
        public ProjectViewModel()
        {

        }

        public ProjectViewModel(NewsDTO row)
        {
            row.Id = Id;
            row.Title = Title;
            row.Desc = Desc;
            row.Url = Url;
            row.Detail = Detail;
            row.HotNews = false;
            row.ImgMain = ImgMain;
            row.Imgs = Imgs;
            row.CreatedDate = DateTime.Now;
            row.View = View;
            row.Tags = Tags;
            row.ProjectType = ProjectType;
            row.Status = Status;
        }




        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tiêu đề không được bỏ trống.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập 1 đoạn miêu tả ngắn.")]
        [AllowHtml]
        public string Desc { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập url .")]
        public string Url { get; set; }

        [AllowHtml]
        public string Detail { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn ảnh đại diện .")]
        public string ImgMain { get; set; }

        public string Imgs { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn định dạng bài viết .")]
        public string Tags { get; set; }
        [Required(ErrorMessage = "Vui lòng chọn định dạng project .")]
        public string ProjectType { get; set; }

        public bool HotNews { get; set; }

        public DateTime CreatedDate { get; set; }

        public int View { get; set; }

        public bool Status { get; set; }
    }
}
