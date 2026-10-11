cmake_minimum_required(VERSION 3.20)

project(EndWeb
        VERSION 1.0.0
        LANGUAGES CXX
)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

include(FetchContent)

find_package(SQLite3 REQUIRED)
find_package(ZLIB REQUIRED)
find_package(CURL REQUIRED)

# ============================================================
# Endstone
# ============================================================

FetchContent_Declare(
        endstone
        GIT_REPOSITORY https://github.com/EndstoneMC/endstone.git
        GIT_TAG v0.11.9
)

FetchContent_MakeAvailable(endstone)


# ============================================================
# cpp-httplib
# ============================================================

FetchContent_Declare(
        httplib
        GIT_REPOSITORY https://github.com/yhirose/cpp-httplib.git
        GIT_TAG v0.23.0
)

FetchContent_MakeAvailable(httplib)


# ============================================================
# Generate embedded web resources
# ============================================================

set(EMBED_DIR
        ${CMAKE_CURRENT_BINARY_DIR}/generated
)

file(MAKE_DIRECTORY ${EMBED_DIR})


set(EMBED_HTML
        ${EMBED_DIR}/web_index.h
)

set(EMBED_CSS
        ${EMBED_DIR}/web_style.h
)

set(EMBED_JS
        ${EMBED_DIR}/web_script.h
)

set(EMBED_CONFIG
        ${EMBED_DIR}/web_config.h
)


add_custom_command(
        OUTPUT
        ${EMBED_HTML}
        ${EMBED_CSS}
        ${EMBED_JS}
        ${EMBED_CONFIG}

        COMMAND
        ${CMAKE_COMMAND}
        -DINPUT=${CMAKE_CURRENT_SOURCE_DIR}/web/index.html
        -DOUTPUT=${EMBED_HTML}
        -DVARIABLE_NAME=WEB_INDEX_HTML
        -P ${CMAKE_CURRENT_SOURCE_DIR}/cmake/embed_file.cmake

        COMMAND
        ${CMAKE_COMMAND}
        -DINPUT=${CMAKE_CURRENT_SOURCE_DIR}/web/style.css
        -DOUTPUT=${EMBED_CSS}
        -DVARIABLE_NAME=WEB_STYLE_CSS
        -P ${CMAKE_CURRENT_SOURCE_DIR}/cmake/embed_file.cmake

        COMMAND
        ${CMAKE_COMMAND}
        -DINPUT=${CMAKE_CURRENT_SOURCE_DIR}/web/script.js
        -DOUTPUT=${EMBED_JS}
        -DVARIABLE_NAME=WEB_SCRIPT_JS
        -P ${CMAKE_CURRENT_SOURCE_DIR}/cmake/embed_file.cmake

        COMMAND
        ${CMAKE_COMMAND}
        -DINPUT=${CMAKE_CURRENT_SOURCE_DIR}/web/config.yml
        -DOUTPUT=${EMBED_CONFIG}
        -DVARIABLE_NAME=WEB_CONFIG_YML
        -P ${CMAKE_CURRENT_SOURCE_DIR}/cmake/embed_file.cmake

        DEPENDS
        ${CMAKE_CURRENT_SOURCE_DIR}/web/index.html
        ${CMAKE_CURRENT_SOURCE_DIR}/web/style.css
        ${CMAKE_CURRENT_SOURCE_DIR}/web/script.js
        ${CMAKE_CURRENT_SOURCE_DIR}/web/config.yml
        ${CMAKE_CURRENT_SOURCE_DIR}/cmake/embed_file.cmake

        VERBATIM
)


add_custom_target(
        embedded_web
        DEPENDS
        ${EMBED_HTML}
        ${EMBED_CSS}
        ${EMBED_JS}
        ${EMBED_CONFIG}
)


# ============================================================
# Endstone plugin
# ============================================================

endstone_add_plugin(
        ${PROJECT_NAME}
        src/plugin.cpp
        src/web_server.cpp
        src/player_database.cpp
        src/message_database.cpp
)

add_dependencies(
        ${PROJECT_NAME}
        embedded_web
)

target_include_directories(
        ${PROJECT_NAME}
        PRIVATE

        ${CMAKE_CURRENT_SOURCE_DIR}/include
        ${EMBED_DIR}
)

target_link_libraries(
        ${PROJECT_NAME}
        PRIVATE

        httplib::httplib
        SQLite::SQLite3
        ZLIB::ZLIB
        CURL::libcurl
)