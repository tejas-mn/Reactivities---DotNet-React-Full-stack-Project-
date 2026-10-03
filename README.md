# Reactivities - .NET-Core-React-Fullstack Project 

A social media like project where users can post events, users can follow each other and comment on the posts in real-time.

## Distributed tracing

Start the observability stack with `docker compose up -d elasticsearch otel-collector kibana jaeger zipkin`, then run the API. The API sends ASP.NET Core, HTTP client, and SQL client traces, plus structured Serilog logs, over OTLP to the Collector at `http://localhost:4317`. The Collector fans traces out to Elasticsearch, Jaeger, and Zipkin, and writes logs to Elasticsearch.

Kibana: [http://localhost:5601](http://localhost:5601)
Elasticsearch: [http://localhost:9200](http://localhost:9200)
Jaeger: [http://localhost:16686](http://localhost:16686)
Zipkin: [http://localhost:9411](http://localhost:9411)

In Kibana, create data views for `otel-traces*` and `otel-logs*` to explore the exported data.

If the API runs in the same Docker Compose network, set `OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317`.

