# Create your models here.

from cassandra.cqlengine import columns
from django_cassandra_engine.models import DjangoCassandraModel


class Session(DjangoCassandraModel):
    session_id = columns.Text(primary_key=True)
    password = columns.Text(required=False, max_length=30)
    created_at = columns.DateTime(required=True)


class Text(DjangoCassandraModel):
    session_id = columns.Text(primary_key=True)
    content = columns.Text(required=True)


class File(DjangoCassandraModel):
    session_id = columns.Text(primary_key=True)
    file_name = columns.Text(primary_key=True)
    content_type = columns.Text(required=True)
    content = columns.Blob(required=True)

    class Meta:
        get_pk_field = 'session_id'
