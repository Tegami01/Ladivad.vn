namespace Model.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updatenews : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.tblNews", "ProjectType", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.tblNews", "ProjectType");
        }
    }
}
