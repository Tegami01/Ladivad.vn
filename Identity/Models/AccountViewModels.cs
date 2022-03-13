using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Identity.Models
{
    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [Display(Name = "Họ tên")]
        public string FullName { get; set; }
    }

    public class ExternalLoginListViewModel
    {
        public string ReturnUrl { get; set; }
    }

    public class SendCodeViewModel
    {
        public string SelectedProvider { get; set; }
        public ICollection<System.Web.Mvc.SelectListItem> Providers { get; set; }
        public string ReturnUrl { get; set; }
        public bool RememberMe { get; set; }
    }

    public class VerifyCodeViewModel
    {
        [Required]
        public string Provider { get; set; }

        [Required]
        [Display(Name = "Code")]
        public string Code { get; set; }
        public string ReturnUrl { get; set; }

        [Display(Name = "Remember this browser?")]
        public bool RememberBrowser { get; set; }

        public bool RememberMe { get; set; }
    }

    public class ForgotViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }


    public class ProfileViewModel
    {
        public string Email { get; set; }

        [Required(ErrorMessage = "(Không được bỏ trống)")]
        [Display(Name = "Họ tên")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "(Không được bỏ trống)")]
        [Display(Name = "Giới tính")]
        public string Gender { get; set; }
        public string Address { get; set; }

        [Required(ErrorMessage = "(Không được bỏ trống)")]
        [Display(Name = "Điện thoại")]
        public string PhoneNumber { get; set; }


        [Required(ErrorMessage = "Ngày sinh Không được bỏ trống")]
        [Display(Name = "Ngày sinh")]
        public DateTime? BirthDay { get; set; }

        [Required(ErrorMessage = "(Không được bỏ trống)")]
        [Display(Name = "Province")]
        public long? ProvinceId { get; set; }


        /// <summary>
        //  Đổi mật khẩu
        /// </summary>      
        [Required(ErrorMessage = "Mật khẩu hiện tại không được bỏ trống")]
        [DataType(DataType.Password)]
        [Display(Name = "Mật khẩu hiện tại")]
        public string OldPassword { get; set; }

        [Required(ErrorMessage = "Mật khẩu mới không được bỏ trống")]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm new password")]
        [Compare("NewPassword", ErrorMessage = "Mật khẩu mới và mật khẩu xác nhận không khớp.")]
        public string ConfirmPassword { get; set; }

        public bool doipass { get; set; }


        /// <summary>
        /// Ngày sinh
        /// </summary>
        public string day { get; set; }
        public string month { get; set; }
        public string year { get; set; }


        /// <summary>
        /// Giới thiệu
        /// </summary>
        public string AffiliateCode { get; set; }
    }


    public class LoginViewModel
    {
        [Required(ErrorMessage = "Vui lòng nhập địa chỉ email")]
        [Display(Name = "Email")]
        [EmailAddress(ErrorMessage = "Địa chỉ email không đúng")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }


        public string RecaptchaPublicKey { get; }
        public LoginViewModel() { }
        public LoginViewModel(string recaptchaPublicKey)
        {
            RecaptchaPublicKey = recaptchaPublicKey;
        }
    }

    public class RegisterViewModel
    {
        [Required(ErrorMessage = "Địa chỉ email không được bỏ trống")]
        [EmailAddress(ErrorMessage = "Địa chỉ email không đúng")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mật khẩu không được bỏ trống")]
        [StringLength(100, ErrorMessage = "Mật khẩu ít nhất 6 ký tự.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "Mật khẩu xác nhận không khớp.")]
        public string ConfirmPassword { get; set; }

        [Display(Name = "Số điện thoại")]
        [Required(ErrorMessage = "Số điện thoại không được bỏ trống")]
        public string PhoneNumber { get; set; }


        [Display(Name = "Ngày sinh")]
        //[Required(ErrorMessage = "Ngày sinh không được bỏ trống")]
        public string BirthDay { get; set; }


        [Display(Name = "CMND/Hộ chiếu/căn cước")]
        //[Required(ErrorMessage = "CMND/Hộ chiếu không được bỏ trống")]
        public string PassportIdentityCard { get; set; }


        [Display(Name = "FullName")]
        [Required(ErrorMessage = "Họ tên không được bỏ trống")]
        public string FullName { get; set; }

        [Display(Name = "Giới tính")]
        //[Required(ErrorMessage = "Giới tính không được bỏ trống")]
        public string Gender { get; set; }


        [Display(Name = "Địa chỉ")]
        //[Required(ErrorMessage = "Địa chỉ không được bỏ trống")]
        public string Address { get; set; }


        [Display(Name = "Mã giới thiệu")]
        public string AffCode { get; set; }


        public string RecaptchaPublicKey { get; }
        public RegisterViewModel() { }
        public RegisterViewModel(string recaptchaPublicKey)
        {
            RecaptchaPublicKey = recaptchaPublicKey;
        }
    }

    public class ResetPasswordViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }

    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    public class UserInfoViewModel
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }

        public bool HasRegistered { get; set; }

        public string LoginProvider { get; set; }
    }


    public class ManageInfoViewModel
    {
        public string LocalLoginProvider { get; set; }

        public string Email { get; set; }

        public IEnumerable<UserLoginInfoViewModel> Logins { get; set; }

        public IEnumerable<ExternalLoginViewModel> ExternalLoginProviders { get; set; }
    }

    public class UserLoginInfoViewModel
    {
        public string LoginProvider { get; set; }

        public string ProviderKey { get; set; }
    }

    public class ExternalLoginViewModel
    {
        public string Name { get; set; }

        public string Url { get; set; }

        public string State { get; set; }
    }
}
