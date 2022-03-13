using Model.DataModel;
using Service.Infrastructure;
using Service.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services
{
    public interface IAttachmentService
    {
        AttachmentDTO Add(AttachmentDTO Attachment);

        void Update(AttachmentDTO Attachment);

        AttachmentDTO Delete(long id);

        IEnumerable<AttachmentDTO> GetAll();

        IEnumerable<AttachmentDTO> SearchByFilename(string keyword);

        AttachmentDTO SearchByFilename(string keyword, string type, long typeId);

        AttachmentDTO GetById(long id);


        IEnumerable<AttachmentDTO> GetById(long id, string type);

        IEnumerable<AttachmentDTO> GetByNewsId(long id);

        void Save();

        void IncreaseView(int id);
    }

    public class AttachmentService : IAttachmentService
    {
        private IAttachmentRepository _attachmentRepository;
        private IUnitOfWork _unitOfWork;

        public AttachmentService(IAttachmentRepository attachmentRepository, IUnitOfWork unitOfWork)
        {
            this._attachmentRepository = attachmentRepository;
            this._unitOfWork = unitOfWork;
        }

        public AttachmentDTO Add(AttachmentDTO Attachment)
        {
            var att = _attachmentRepository.Add(Attachment);
            _unitOfWork.Commit();

            return att;
        }

        public AttachmentDTO Delete(long id)
        {
            return _attachmentRepository.Delete(id);
        }

        public IEnumerable<AttachmentDTO> GetAll()
        {
            return _attachmentRepository.GetAll();
        }

        public IEnumerable<AttachmentDTO> SearchByFilename(string keyword)
        {
            if (!string.IsNullOrEmpty(keyword))
                return _attachmentRepository.GetMulti(x => x.FileName.Contains(keyword) || x.Description.Contains(keyword));
            else
                return _attachmentRepository.GetAll();
        }

        public AttachmentDTO SearchByFilename(string keyword, string type, long typeId)
        {
            return _attachmentRepository.GetMulti(x => x.FileName == keyword && x.DataType == type && x.NewsId == typeId).FirstOrDefault();
        }

        public AttachmentDTO GetById(long id)
        {
            return _attachmentRepository.GetSingleById(id);
        }

        public IEnumerable<AttachmentDTO> GetById(long id, string type)
        {
            return _attachmentRepository.GetById(id, type);
        }

        public void IncreaseView(int id)
        {
            throw new NotImplementedException();
        }

        public void Save()
        {
            _unitOfWork.Commit();
        }

        public void Update(AttachmentDTO Attachment)
        {
            _attachmentRepository.Update(Attachment);
        }

        public IEnumerable<AttachmentDTO> GetByNewsId(long id)
        {
            throw new NotImplementedException();
        }
    }
}
