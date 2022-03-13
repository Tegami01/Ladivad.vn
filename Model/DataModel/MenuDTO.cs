using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.DataModel
{
    [Table("tblMenu")]
    public class MenuDTO
    {
        public MenuDTO()
        {
            MenuSub = new HashSet<MenuDTO>();
        }
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage ="Vui lòng nhập tên menu !!!")]
        public string Name { get; set; }
        public int? ParentId { get; set; }
        public string Url { get; set; }


        public virtual ICollection<MenuDTO> MenuSub { get; set; }

        public virtual MenuDTO ParentMenu { get; set; }
    }
}
