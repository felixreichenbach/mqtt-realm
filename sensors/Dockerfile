FROM python:slim

WORKDIR /usr/src/app

#  RUN pip install --no-cache-dir -r requirements.txt
RUN pip install paho-mqtt
RUN pip install sense-hat

COPY . .

CMD [ "python", "./temperature.py" ]