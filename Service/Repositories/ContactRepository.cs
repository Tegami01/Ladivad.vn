using Model.DataModel;
using Service.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Repositories
{
    public interface IContactRepository : IRepository<ContactDTO> { }
    public class ContactRepository : RepositoryBase<ContactDTO> , IContactRepository
    {
        public ContactRepository(IDbFactory dbFactory) : base(dbFactory) { }
    }
}
