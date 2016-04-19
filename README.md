App for demo purpose
# Idea 
  Dynamic pricing for rental services.

# Background:
  In order to increase customer adoption, companies resort to discounts and offers. Mostly, these discounts are self funded and can cause high burn rates.

  It's undeniable that customers show interests towards attractive prices. By dynamically pricing a product an "opportunity" of great savings can be offered to customers. Implementing strategies suggested through this demo would help businesses quote competitive prices. The mentioned strategies aims to distribute the expenses of discount effectively across the system.

### Possible Extensions / Roadmap
  * User Scoring service:
  Creating a separate service to manage user's score (Similar to reputations in Stack Overflow) based on their actions. User actions will be shared with the service through messaging services like Apache Kafka or NATS depending on our requirements from a messaging system. Since, scores will be highly volatile in nature it could be separately cached in a Redis instance.

  * User service to manage friends:
  This would be a service which records every instance of newly created user and would also create relationship in a Neo4j database when a connection is created between two users. User details could be indexed in an Elasticsearch instance.

##### NOTE: 
Share your expectations so that I can extend it using any technology that has caught your interests.
