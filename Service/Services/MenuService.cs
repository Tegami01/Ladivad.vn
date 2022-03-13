using Model.DataModel;
using Service.Infrastructure;
using Service.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace Service.Services
{
    public interface IMenuService
    {
        MenuDTO Add(MenuDTO Menu);
        void Update(MenuDTO Menu);
        void Delete(int Id);
        IEnumerable<MenuDTO> GetAll();
        IEnumerable<MenuDTO> GetAllOr(string keyword);
        MenuDTO GetbyId(int Id);
        IEnumerable<MenuDTO> GetAllParent();
        SelectList SelectList();
        IEnumerable<MenuDTO> GetByParentId(int id);
        void Save();
    }
    public class MenuService : IMenuService
    {
        private IMenuRepository _menuRepository;
        private IUnitOfWork _unitOfWork;

        public MenuService(IMenuRepository menuRepository, IUnitOfWork unitOfWork)
        {
            this._menuRepository = menuRepository;
            this._unitOfWork = unitOfWork;
        }
        public MenuDTO Add(MenuDTO Menu)
        {
            var menu = _menuRepository.Add(Menu);
            _unitOfWork.Commit();
            return menu;
        }

        public void Delete(int Id)
        {
            _menuRepository.Delete(Id);
        }

        public IEnumerable<MenuDTO> GetAll()
        {
            return _menuRepository.GetAll().Where(x => x.ParentId == null);
        }

        public IEnumerable<MenuDTO> GetAllOr(string keyword)
        {
            if (!string.IsNullOrEmpty(keyword))
              return _menuRepository.GetMulti(x => x.Name.Contains(keyword) ||x.Url.Contains(keyword)).Where(x => x.ParentId == null).OrderBy(x =>x.Id);
           else
              return _menuRepository.GetAll().Where(x => x.ParentId == null).OrderBy(x => x.Id);
        }

        public IEnumerable<MenuDTO> GetAllParent()
        {
            return _menuRepository.GetMulti(x => x.ParentId == null);
        }

        public MenuDTO GetbyId(int Id)
        {
            return _menuRepository.GetSingleById(Id);
        }

        public IEnumerable<MenuDTO> GetByParentId(int id)
        {
            return _menuRepository.GetMulti(x => x.ParentId == id);
        }

        public void Save()
        {
            _unitOfWork.Commit();
        }

        public SelectList SelectList()
        {
            return _menuRepository.SelectName();
        }

        public void Update(MenuDTO Menu)
        {
            _menuRepository.Update(Menu);
        }
    }
}
