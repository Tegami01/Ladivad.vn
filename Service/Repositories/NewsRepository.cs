using Model.DataModel;
using Service.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Repositories
{
    public interface INewsRepository : IRepository<NewsDTO> { }
    public class NewsRepository : RepositoryBase<NewsDTO>, INewsRepository
    {
        public NewsRepository(IDbFactory dbFactory) : base(dbFactory) { }
    }
}
