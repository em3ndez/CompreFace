import logging

from src.services.flask_.constants import API_KEY_HEADER


class FlaskRequestContextAdder(logging.Filter):
    @staticmethod
    def _update_record(record):
        from flask import request
        if not request:
            return
        record.request_dict = dict(
            method=request.method,
            path=request.full_path[:-1] if request.full_path.endswith("?") else request.full_path,
            filename=request.files['file'].filename if 'file' in request.files else '',
            api_key=request.headers[API_KEY_HEADER] if API_KEY_HEADER in request.headers else '',
            remote_addr=request.remote_addr
        )

    def filter(self, record):
        # noinspection PyTypeChecker
        self._update_record(record)
        return True


def request_dict_to_str(request_dict):
    if not request_dict:
        return None
    request_elements = (request_dict['method'],
                        request_dict['path'],
                        request_dict['filename'],
                        request_dict['api_key'],
                        request_dict['remote_addr'])
    return f"{' '.join(str(k) for k in request_elements if k)}"
