namespace Model.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class a : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.tblNews", "ImgMain", c => c.String(nullable: false));
            AlterColumn("dbo.tblNews", "Imgs", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.tblNews", "Imgs", c => c.String());
            AlterColumn("dbo.tblNews", "ImgMain", c => c.String());
        }
    }
}
