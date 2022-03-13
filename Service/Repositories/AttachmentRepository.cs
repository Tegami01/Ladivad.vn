using Model.DataModel;
using Service.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Repositories
{
    public interface IAttachmentRepository : IRepository<AttachmentDTO>
    {
        IEnumerable<AttachmentDTO> GetById(long id, string type);
    }

    public class AttachmentRepository : RepositoryBase<AttachmentDTO>, IAttachmentRepository
    {
        public AttachmentRepository(IDbFactory dbFactory) : base(dbFactory)
        {
            //
        }

        public IEnumerable<AttachmentDTO> GetById(long id, string type)
        {
            if (type == "news")
            {
                if (DbContext.Attachment.Where(x => x.NewsId == id).FirstOrDefault() != null)
                {
                    if (DbContext.Attachment.Where(x => x.NewsId == id).FirstOrDefault().Sorting != 0)
                        return DbContext.Attachment.Where(x => x.NewsId == id && x.DataType == type).OrderBy(x => x.Sorting).ToList();

                    return DbContext.Attachment.Where(x => x.NewsId == id && x.DataType == type).OrderBy(x => x.AttachmentId).ToList();
                }
                else
                {
                    return null;
                }
            }

            return null;
        }
    }
}
