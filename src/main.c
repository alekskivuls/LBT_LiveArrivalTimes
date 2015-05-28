#include "pebble.h"

#define NUM_MENU_SECTIONS 1
#define NUM_FIRST_MENU_ITEMS 3

static Window *s_main_window;
static SimpleMenuLayer *s_simple_menu_layer;
static SimpleMenuSection s_menu_sections[NUM_MENU_SECTIONS];
static SimpleMenuItem s_first_menu_items[NUM_FIRST_MENU_ITEMS];

static char *s_buffer;

//Parse the routes json data
static void parse_data() {
    
}

//Load the routes resource file
static void load_resource() {
  // Get resource and size
  ResHandle handle = resource_get_handle(RESOURCE_ID_DATA_ROUTES);
  size_t res_size = resource_size(handle);

  // Copy to buffer
  s_buffer = (char*)malloc(res_size);
  resource_load(handle, (uint8_t*)s_buffer, res_size);
    
  parse_data();
}

//Simple selection listener
static void menu_select_callback(int index, void *ctx) {
  s_first_menu_items[index].subtitle = "Selected";
  layer_mark_dirty(simple_menu_layer_get_layer(s_simple_menu_layer));
}

//Load the UI
static void main_window_load(Window *window) {
  int num_a_items = 0;

  s_first_menu_items[num_a_items++] = (SimpleMenuItem) {
    .title = "Route",
    .callback = menu_select_callback,
  };
  s_first_menu_items[num_a_items++] = (SimpleMenuItem) {
    .title = "Direction",
    .callback = menu_select_callback,
  };
  s_first_menu_items[num_a_items++] = (SimpleMenuItem) {
    .title = "Stop corner",
    .subtitle = "at corner",
    .callback = menu_select_callback,
  };

  s_menu_sections[0] = (SimpleMenuSection) {
    .title = "Routes",
    .num_items = NUM_FIRST_MENU_ITEMS,
    .items = s_first_menu_items,
  };

  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_frame(window_layer);

  s_simple_menu_layer = simple_menu_layer_create(bounds, window, s_menu_sections, NUM_MENU_SECTIONS, NULL);

  layer_add_child(window_layer, simple_menu_layer_get_layer(s_simple_menu_layer));
}

//Delete the UI
void main_window_unload(Window *window) {
  simple_menu_layer_destroy(s_simple_menu_layer);
}

//Create a window and load resources
static void init() {
  s_main_window = window_create();
  window_set_window_handlers(s_main_window, (WindowHandlers) {
    .load = main_window_load,
    .unload = main_window_unload,
  });
  window_stack_push(s_main_window, true);
    
  load_resource();
}

//Destroy the window and free the buffer
static void deinit() {
  window_destroy(s_main_window);
    
  free(s_buffer);
}

int main(void) {
  init();
  app_event_loop();
  deinit();
}