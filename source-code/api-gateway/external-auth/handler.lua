local http = require "resty.http"
local ngx = require "ngx"
local cjson = require "cjson"

local ExternalAuthHandler = {
    VERSION = "1.0",
    PRIORITY = 1000,
}

function ExternalAuthHandler:access(conf)
    local path = kong.request.get_path()
    local publicPaths = conf.public_paths;

    for i, pub_path in ipairs(publicPaths) do
        if pub_path == path then
            return
        end
    end

    local client = http.new()

    kong.log("Validating Authentication: ", conf.url)
    local res, err = client:request_uri(conf.url, {
        ssl_verify = false,
        headers = {
            Authorization = kong.request.get_header("Authorization"),
        }
    })

    if not res then
        kong.log.err("Invalid Authentication Response: ", err)
        return kong.response.exit(500)
    end

    if res.status == 200 then
        local json = cjson.encode(res.body)
        local user_info = cjson.decode(json)
        kong.log(user_info)
        kong.service.request.set_header("x-userinfo", ngx.encode_base64(user_info))
    else
        kong.log.err("Invalid Authentication Response Status: ", res.status)
    end

end

return ExternalAuthHandler
