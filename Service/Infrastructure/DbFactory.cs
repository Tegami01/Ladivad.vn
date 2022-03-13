using Model;

namespace Service.Infrastructure
{
    public class DbFactory : Disposable, IDbFactory
    {
        private LadivadDbContext dbContext;

        public LadivadDbContext Init()
        {
            return dbContext ?? (dbContext = new LadivadDbContext());
        }

        protected override void DisposeCore()
        {
            if (dbContext != null)
                dbContext.Dispose();
        }
    }
}
