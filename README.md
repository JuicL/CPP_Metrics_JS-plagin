Plugin for starting the collection of metrics of c++ code. Creates reports in HTML and XML formats.
Supports collection of the following metrics: 
-   Cyclomatic complexity
-   SLOC
-   Inheritance Tree Depth
-   Afferent Coupling
-   Efferent Coupling
-   Instability
-   Distance.

Path to core: https://github.com/JuicL/CPP_Metrics

Getting Started: To get started, set the path to core (CPPMetrics.CorePath). For correct analysis of files, specify additional libraries used in the project (CPPMetrics.InludePath). By default, output files with reports will be saved in the root folder with the project in the created Report folder.

## Commands:
cppM: Start metric collection

cppM: Initialize project name

cppM: Set additional compiler library files

cppM: Set path to cppmetrics core

cppM: Set output to report

cppM: Update project name

cppM: Delete project name



## Settings: 
- Path to additional compiler library files ( Default: [] )
- Path to core (Default: "")
- Output path for reports (Default: The root folder. Report folder is created)
