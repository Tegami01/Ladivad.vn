using Model.DataModel;
using Service.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Repositories
{
    public interface ISliderRepository : IRepository<SliderDTO> { }
    public class SliderRepository : RepositoryBase<SliderDTO>, ISliderRepository
    {
        public SliderRepository(IDbFactory dbFactory) : base(dbFactory) { }
    }
}
