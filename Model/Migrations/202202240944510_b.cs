namespace Model.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class b : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.tblNews", "Url", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.tblNews", "Url", c => c.String());
        }
    }
}
