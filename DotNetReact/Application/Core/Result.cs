namespace Application.Core
{
    public class Result<T>
    {
        public bool IsSucess { get; private set;  }
        public T Value {get; private set; }
        public string Error {get; private set; }
        public static Result<T> Success(T value) => new Result<T> {IsSucess = true, Value = value};
        public static Result<T> Failure(string error) => new Result<T> {IsSucess = false, Error = error};
        
    }
}