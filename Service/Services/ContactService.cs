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
    public interface IContactService
    {
        ContactDTO Add(ContactDTO contact);
        IEnumerable<ContactDTO> GetAll(string keyword);
        ContactDTO GetById(int id);
        void Save();
    }
    public class ContactService : IContactService
    {
        private IContactRepository _contactRepository;
        private IUnitOfWork _unitOfWork;

        public ContactService(IContactRepository contactRepository , IUnitOfWork unitOfWork)
        {
            this._contactRepository = contactRepository;
            this._unitOfWork = unitOfWork;
        }

        public ContactDTO Add(ContactDTO contact)
        {
            var ct = _contactRepository.Add(contact);
            _unitOfWork.Commit();
            return ct;
        }

        public IEnumerable<ContactDTO> GetAll(string keyword)
        {
            if (!string.IsNullOrEmpty(keyword))
                return _contactRepository.GetMulti(x => x.FullName.Contains(keyword) || x.PhoneNumber.Contains(keyword) || x.Email.Contains(keyword)).OrderByDescending(x => x.Id);
            else
                return _contactRepository.GetAll().OrderByDescending(x => x.Id);
        }

        public ContactDTO GetById(int id)
        {
            return _contactRepository.GetSingleById(id);
        }

        public void Save()
        {
            _unitOfWork.Commit();
        }
    }
}
