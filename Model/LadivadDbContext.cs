using Model.DataModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public partial class LadivadDbContext : DbContext
    {
        public LadivadDbContext() : base("name=LadivadDbContext")
        {
            
        }

        public virtual DbSet<NewsDTO> News { get; set; }
        public virtual DbSet<SliderDTO> Slider { get; set; }
        public virtual DbSet<ContactDTO> Contact { get; set; }
        public virtual DbSet<MenuDTO> Menu { get; set; }
        public virtual DbSet<AttachmentDTO> Attachment { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MenuDTO>()
            .HasMany(e => e.MenuSub)
            .WithOptional(e => e.ParentMenu)
            .HasForeignKey(e => e.ParentId);

        }
    }
}
