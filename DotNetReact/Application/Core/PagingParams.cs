namespace Applcation.Core
{
    public class PagingParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber {get; set;} = 1;
        private int _pageSize = 2;
        public int PageSize 
        {
            get => _pageSize;
            set => _pageSize = Math.Min(value, MaxPageSize);
        }
    }
}