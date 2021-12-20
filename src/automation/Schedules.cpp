#include "./ChannelMqttSettingsService.h"
#include "./TaskScheduler.h"
#include "./ChannelStateService.h"
#include "./ChannelScheduleRestartService.h"
#include "./SystemStateService.h"
#include "./Utilities.h"
#include "Schedules.h"

Schedules::Schedules(Automation *automation){
   _automation = automation;
};

void Schedules::addSchedule(ScheduleTask scheduleTask){
    _scheduleTaskList.push_back(scheduleTask);
};

void Schedules::runSchedules(){
    _automation->setSchedules(&_scheduleTaskList);
};

void Schedules::beginSchedules(){
    for(std::list<ScheduleTask>::iterator i = _scheduleTaskList.begin(); i != _scheduleTaskList.end();)
    {
        i->channelTaskScheduler->begin();
        i++;
    }
};

void Schedules::setScheduleTimes(){
    for(std::list<ScheduleTask>::iterator i = _scheduleTaskList.begin(); i != _scheduleTaskList.end();)
    {
        i->channelTaskScheduler->setScheduleTimes();
        i++;
    }
};