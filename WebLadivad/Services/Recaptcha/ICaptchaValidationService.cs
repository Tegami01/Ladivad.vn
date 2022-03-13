using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebLadivad.Services
{
    public interface ICaptchaValidationService
    {
        bool Validate(string response);
    }
}