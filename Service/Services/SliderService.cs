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
    public interface ISliderService
    {
        SliderDTO Add(SliderDTO Slider);
        void Update(SliderDTO Slider);
        SliderDTO Delete(int Id);
        IEnumerable<SliderDTO> GetAll();
        SliderDTO GetbyId(int Id);
        void Save();
    }
    public class SliderService : ISliderService
    {
        private ISliderRepository _sliderRepository;
        private IUnitOfWork _unitOfWork;

        public SliderService(ISliderRepository sliderRepository, IUnitOfWork unitOfWork)
        {
            this._sliderRepository = sliderRepository;
            this._unitOfWork = unitOfWork;
        }
        public SliderDTO Add(SliderDTO Slider)
        {
            var menu = _sliderRepository.Add(Slider);

            return menu;
        }

        public SliderDTO Delete(int Id)
        {
            return _sliderRepository.Delete(Id);
        }

        public IEnumerable<SliderDTO> GetAll()
        {
            return _sliderRepository.GetAll().OrderBy(x => x.Id);
        }

        public SliderDTO GetbyId(int Id)
        {
            return _sliderRepository.GetSingleById(Id);
        }

        public void Save()
        {
            _unitOfWork.Commit();
        }

        public void Update(SliderDTO Slider)
        {
            _sliderRepository.Update(Slider);
        }
    }
}
