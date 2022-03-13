using Autofac;
using WebLadivad.Services;

namespace WebLadivad.Models
{
    public class ServicesModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.Register(ctx =>
            {
                return new InvisibleRecaptchaValidationService(ConfigHelper.GetByKey("Recaptcha:SecretKey"));
            }).As<ICaptchaValidationService>().InstancePerRequest();

            base.Load(builder);
        }
    }
}