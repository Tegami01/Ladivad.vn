using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{

    [Serializable]
    public sealed class ApiResponse<TResult>
    {
        [JsonProperty("code")]
        public long Code { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }

        [JsonProperty("data")]
        public TResult Data { get; set; }

        //[JsonProperty("shops")]
        //public Store[] Shops { get; set; }

        public bool Successed => Code == 200 || string.Equals(Message, "SUCCESS", StringComparison.OrdinalIgnoreCase);
    }
}
