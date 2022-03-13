using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.DataModel
{
    [Table("tblContact")]
    public class ContactDTO
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage ="Vui lòng nhập họ tên")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập số điện thoại")]
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập email")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập địa chỉ")]
        public string Address { get; set; }
        public DateTime Now { get; set; }
        public bool project1 { get; set; }
        public bool project2 { get; set; }
        public bool project3 { get; set; }
        public bool service1 { get; set; }
        public bool service2 { get; set; }
        public bool service3 { get; set; }

        public string Note { get; set; }
    }
}
