using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Abstract
{
    public abstract class Auditable : IAuditable
    {
        [DisplayFormat(DataFormatString = "{0:dd MMM yyyy}")]
        public DateTime? CreatedDate { set; get; }

        [MaxLength(256)]
        public string CreatedBy { set; get; }

        public DateTime? UpdatedDate { set; get; }

        [MaxLength(256)]
        public string UpdatedBy { set; get; }     

        public bool Active { get; set; }

        [StringLength(255)]
        public string MetaTitle { get; set; }

        [StringLength(255)]
        public string MetaKeyword { get; set; }

        [StringLength(350)]
        public string MetaDescription { get; set; }
    }
}
