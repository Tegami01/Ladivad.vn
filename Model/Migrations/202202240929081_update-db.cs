namespace Model.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updatedb : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.tblNews", "Imgs", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.tblNews", "Imgs", c => c.String(nullable: false));
        }
    }
}
