namespace Model.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class up : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.tblNews", "Project", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.tblNews", "Project");
        }
    }
}
