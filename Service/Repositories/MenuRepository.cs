using Model.DataModel;
using Service.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Service.Repositories
{
    public interface IMenuRepository : IRepository<MenuDTO> {
        SelectList SelectName();
    }
    public class MenuRepository : RepositoryBase<MenuDTO>, IMenuRepository
    {
        public MenuRepository(IDbFactory dbFactory) : base(dbFactory)
        {

        }

        public SelectList SelectName()
        {
            return new SelectList(DbContext.Menu.Where(m => m.ParentId == null).Select(m => m.Name));
        }
    }
}
