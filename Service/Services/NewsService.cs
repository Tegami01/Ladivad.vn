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
    public interface INewsService
    {
        NewsDTO Add(NewsDTO New);
        void Update(NewsDTO New);
        NewsDTO Delete(int Id);
        IEnumerable<NewsDTO> GetAll(string keyword);
        IEnumerable<NewsDTO> GetAlls(string keyword);
        IEnumerable<NewsDTO> GetByHotNews();
        IEnumerable<NewsDTO> GetByNews();

        IEnumerable<NewsDTO> GetByViewNews();
        IEnumerable<NewsDTO> GetByViewProject();

        IEnumerable<NewsDTO> GetByProject();
        
        IEnumerable<NewsDTO> GetByProject1();
        IEnumerable<NewsDTO> GetByProject5();
        IEnumerable<NewsDTO> GetByProject9();
        IEnumerable<NewsDTO> GetByProject10();

        IEnumerable<NewsDTO> GetByProjectInterior(string tag,string project, string projecttype , int take , int skip);


        IEnumerable<NewsDTO> GetByProjectNT();
        IEnumerable<NewsDTO> GetByProjectN();
        NewsDTO GetbyId(int Id);
        NewsDTO GetByUrl(string url);
        void Save();
    }
    public class NewsService : INewsService
    {
        private INewsRepository _newsRepository;
        private IUnitOfWork _unitOfWork;

        public NewsService(INewsRepository newsRepository, IUnitOfWork unitOfWork)
        {
            this._newsRepository = newsRepository;
            this._unitOfWork = unitOfWork;
        }
        public NewsDTO Add(NewsDTO New)
        {
            var menu = _newsRepository.Add(New);
           
            return menu;
        }

        public NewsDTO Delete(int Id)
        {
            return _newsRepository.Delete(Id);
        }

        public IEnumerable<NewsDTO> GetAll(string keyword)
        {
            var model = _newsRepository.GetMulti(x => x.Title != null).Skip(0).Take(4);

            if (!string.IsNullOrEmpty(keyword))
                return _newsRepository.GetMulti(x => x.Url.Contains(keyword) || x.Title.Contains(keyword)).OrderByDescending(x => x.Id);
            else
                return _newsRepository.GetAll().OrderByDescending(x => x.Id);
        }

        public IEnumerable<NewsDTO> GetByHotNews()
        {
            return _newsRepository.GetAll().Where(x =>x.HotNews == true).OrderByDescending(x => x.Id);
        }

        public NewsDTO GetbyId(int Id)
        {
            return _newsRepository.GetSingleById(Id);
        }

        public IEnumerable<NewsDTO> GetByNews()
        {
            return _newsRepository.GetAll().Where(x => x.Status == true && x.Tags == "News").OrderByDescending(x => x.Id);
        }

        public IEnumerable<NewsDTO> GetByProject()
        {
            return _newsRepository.GetAll().Where(x => x.Status == true && x.Tags == "Project").OrderByDescending(x => x.Id);
        }

        public IEnumerable<NewsDTO> GetByProject1()
        {
            return _newsRepository.GetAll().Where(x => x.Status == true && x.Tags == "Project").Take(4).OrderByDescending(x => x.Id);
        }

        public IEnumerable<NewsDTO> GetByProject5()
        {
            return _newsRepository.GetAll().Where(x => x.Status == true && x.Tags == "Project").Skip(4).Take(1).OrderByDescending(x => x.Id);
        }

        public IEnumerable<NewsDTO> GetByProject9()
        {
            return _newsRepository.GetAll().Where(x => x.Status == true && x.Tags == "Project").Skip(5).Take(4).OrderByDescending(x => x.Id);
        }

        public IEnumerable<NewsDTO> GetByProject10()
        {
            return _newsRepository.GetAll().Where(x => x.Status == true && x.Tags == "Project").Skip(9).Take(1).OrderByDescending(x => x.Id);
        }

        public IEnumerable<NewsDTO> GetByProjectN()
        {
            return _newsRepository.GetAll().Where(x => x.Status == true && x.Tags == "Project" && x.Project == "noi-that").OrderByDescending(x => x.Id);
        }

        public IEnumerable<NewsDTO> GetByProjectNT()
        {
            return _newsRepository.GetAll().Where(x => x.Status == true && x.Tags == "Project" && x.Project == "ngoai-that").OrderByDescending(x => x.Id);
        }

        public NewsDTO GetByUrl(string url)
        {
            return _newsRepository.GetSingleByCondition(x => x.Url == url);
        }

        public void Save()
        {
            _unitOfWork.Commit();
        }

        public void Update(NewsDTO New)
        {
            _newsRepository.Update(New);
        }

        public IEnumerable<NewsDTO> GetAlls(string keyword)
        {
           
            if (!string.IsNullOrEmpty(keyword))
                return _newsRepository.GetMulti(x => x.Url.Contains(keyword) || x.Title.Contains(keyword)).Where(x =>x.Status == true).Where(x => x.Tags != "News").OrderByDescending(x => x.Id);
            else
                return _newsRepository.GetAll().Where(x => x.Status == true).Where(x => x.Tags != "News").OrderByDescending(x => x.Id);
        }

        public IEnumerable<NewsDTO> GetByProjectInterior(string tag, string project, string projecttype, int take, int skip)
        {
            return _newsRepository.GetAll().Where(x => x.Status == true && x.Tags == tag && x.Project == project && x.ProjectType == projecttype).Skip(skip).Take(take).OrderByDescending(x => x.Id);
        }

        public IEnumerable<NewsDTO> GetByViewNews()
        {
           return _newsRepository.GetAll().Where(x => x.Status == true && x.Tags == "News").OrderByDescending(x =>x.View).Take(5);
        }

        public IEnumerable<NewsDTO> GetByViewProject()
        {
            return _newsRepository.GetAll().Where(x => x.Status == true && x.Tags == "Project").OrderByDescending(x => x.View).Take(5);
        }
    }
}
