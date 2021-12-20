#ifndef Schedules_h
#define Schedules_h

#include "./Automation.h"

class Schedules {
    public:
    Schedules(Automation* automation);
    void addSchedule(ScheduleTask scheduleTask);
    void beginSchedules();
    void runSchedules();
    void setScheduleTimes();

    private:
    std::list<ScheduleTask> _scheduleTaskList;
    void setSchedules();
    Automation* _automation;

};

#endif // Schedules_h