using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.DataModel
{
    [Table("tblAttachment")]
    public class AttachmentDTO
    {
        [Key]
        public long AttachmentId { get; set; }


        public long? NewsId { get; set; }

        public string DataType { get; set; }        // Product hoặc News

        [StringLength(250)]
        public string FileName { get; set; }        // FileName

        public int FileSize { get; set; }           // Kích thước file

        [StringLength(250)]
        public string Description { get; set; }     // Desc, Alt Image..


        public int Sorting { get; set; }            // Sắp xếp
    }
}
