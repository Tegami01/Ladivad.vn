using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.DataModel
{
    [Table("tblSlider")]
    public class SliderDTO
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập ảnh")]
        public string Img { get; set; }
        public bool Status { get; set; }
        public string Url { get; set; }
    }
}
