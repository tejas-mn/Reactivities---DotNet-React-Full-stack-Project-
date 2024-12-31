using System.Text.Json;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage, int itemsPerPage, int totalsItems, int totalPages)
        {
            var paginationHeader = new 
            {
                currentPage,
                itemsPerPage,
                totalsItems,
                totalPages
            };

            response.Headers.Append("Pagination", JsonSerializer.Serialize(paginationHeader));
        }
    }
}