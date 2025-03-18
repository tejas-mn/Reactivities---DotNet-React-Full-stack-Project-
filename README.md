# Reactivities - .NET-Core-React-Fullstack Project 

A social media like project where users can post events, users can follow each other and comment on the posts in real-time.

Learnings:

## Clean Architecture

API -> Application -> Domain <- Persistence
           |
           |->Infrastructure Services (Eg: access to security services like for gettting currenlty logged in user etc.. )
           |
           |->External Services

---------------------------------------------------------------------------

API - 

 -- API Interfaces to expose endpoints, Http methods, Fault Codes etc , Service Interfaces to access application logic
 -- Controllers, HTTP Fault Handling, Middlewares, Req Res DTOs, Serialization, Authorization and Authentication  etc
 -- Can be broken down to multiple domain services if its large application.
 -- API Tests, Mocks
 
----------------------------------------------------------------------------

Application (CORE) - 

 -- Service Layer which implements service interfaces required for the API layer to expose business logic independent of UI / API / Console / GUI 
 -- Command Requests, Command Validators, Command Handlers, Domain Events etc for implementing use case logic, Design patterns for application logic etc..
 -- Req Res DTOs, Contracts, DTO Validators, Mappings between DTOs, Interfaces to access Domain layer to perform database operations
 -- Any other interface to perform any other operations from external / infrastructure services whose implementation can be provided from any vendors
 -- Can be broken down to multiple domains if its large application and have dependency.
 -- Unit Tests for validators, use cases etc.., Mocks for mocking databases, external services

----------------------------------------------------------------------------

Infrastructure - 

  -- Security services
  -- Cloud services
  -- Network services
  -- API tracing & Monitoring services
  -- Redis Caching, ElasticSearch etc
  -- Devops Deployments etc..

----------------------------------------------------------------------------

Domain - 
  
  -- Domain Entities that can be translated to database tables / ORM which is independent of which database / persistence layer 
  -- Repositories, UOW etc implementing interfaces to perform db operations required for application/business logic 
  -- Mapping between different Domain entities to DTOs etc.., Stored Procs, SQL Files, Triggers etc..

----------------------------------------------------------------------------

Persistence - 

  -- More Specific to particular databases
  -- Seeding, DB Migrations to translate Domain entities to actual db specific tables
  -- Anything tighly coupled to db technology
