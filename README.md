# Reactivities - .NET-Core-React-Fullstack Project 

A social media like project where users can post events, users can follow each other and comment on the posts in real-time.

## Distributed tracing

Start the observability stack with `docker compose up -d elasticsearch apm-server otel-collector kibana jaeger zipkin grafana`, then run the API. The API sends ASP.NET Core, HTTP client, and SQL client traces, plus structured Serilog logs, over OTLP to the Collector at `http://localhost:4317`. The Collector forwards traces to Elastic APM Server, Jaeger, and Zipkin, and writes logs to Elasticsearch.

Kibana: [http://localhost:5601](http://localhost:5601)
Grafana: [http://localhost:3000](http://localhost:3000)
Elasticsearch: [http://localhost:9200](http://localhost:9200)
Elastic APM intake: [http://localhost:8200](http://localhost:8200)
Jaeger: [http://localhost:16686](http://localhost:16686)
Zipkin: [http://localhost:9411](http://localhost:9411)

In Kibana, open **Observability > APM > Services** to view `DotNetReact_API`, transactions, and trace waterfalls. Use Discover with a data view for `otel-logs-nanos*` to explore logs; new logs use Elasticsearch `date_nanos` precision, while older logs remain in `otel-logs*` with millisecond precision. A standalone APM Server handles OTLP directly, so this view does not require Fleet enrollment.

In Grafana, open **Explore** and select **Jaeger** to search traces and inspect span waterfalls, or **Elasticsearch Logs** to query `otel-logs-nanos*`. These data sources are provisioned automatically. The local Grafana login defaults to `admin` / `admin`; set `GRAFANA_ADMIN_PASSWORD` in `.env` before exposing Grafana beyond your development machine. Grafana is currently configured for logs and traces; this stack does not yet export metrics.

For local development the APM secret token defaults to `dev-apm-token-change-me`. Set `ELASTIC_APM_SECRET_TOKEN` in `.env` to replace it; use a strong secret outside local development.

If the API runs in the same Docker Compose network, set `OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317`.

