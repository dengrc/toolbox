<template>
  <v-card>
    <v-app-bar app elevate-on-scroll>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

      <v-toolbar-title>Vue Props</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon color="primary" @click="exportTSCode">
        <v-icon>mdi-language-typescript</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-data-table :headers="headers" :items="desserts" disable-pagination>
        <template v-slot:item.prop="props">
          <v-edit-dialog persistent large :return-value.sync="props.item.prop" @save="save" @cancel="cancel" @open="open" @close="close('prop',props.item)"> {{ props.item.prop }}
            <template v-slot:input>
              <v-text-field v-model="props.item.prop" :rules="[max25chars]" label="Edit" single-line counter></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.default="props">
          <v-edit-dialog persistent large :return-value.sync="props.item.default" @save="save" @cancel="cancel" @open="open" @close="close('default',props.item)"> {{ props.item.default }}
            <template v-slot:input>
              <v-textarea v-model="props.item.default" label="Edit" counter></v-textarea>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.required="props">
          <v-checkbox v-model="props.item.required"></v-checkbox>
        </template>
        <template v-slot:item.type="props">
          <v-edit-dialog persistent large :return-value.sync="props.item.type" @save="save" @cancel="cancel" @open="open" @close="close('type',props.item)"> {{ props.item.type }}
            <template v-slot:input>
              <v-select :items="typeList" label="Type" v-model="props.item.type" multiple></v-select>
            </template>
          </v-edit-dialog>
        </template>
        <!-- <template v-slot:item.iron="props">
        <v-edit-dialog :return-value.sync="props.item.iron" large persistent @save="save" @cancel="cancel" @open="open" @close="close">
          <div>{{ props.item.iron }}</div>
          <template v-slot:input>
            <div class="mt-4 title">Update Iron</div>
          </template>
          <template v-slot:input>
            <v-text-field v-model="props.item.iron" :rules="[max25chars]" label="Edit" single-line counter autofocus></v-text-field>
          </template>
        </v-edit-dialog>
      </template> -->
      </v-data-table>
      <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
        {{ snackText }}
        <v-btn text @click="snack = false">Close</v-btn>
      </v-snackbar>
    </v-content>
  </v-card>
</template>
<script lang="ts">
import Vue from "vue";

interface IPropItem {
  required: boolean;
  prop: string;
  localProp: string;
  type: Array<string>;
  default: string;
  watch: string;
}

function toUpperCase(string: string) {
  if (string.length === 0) {
    return string;
  }
  return string[0].toUpperCase() + string.slice(1);
}

function toLowerCase(string: string) {
  if (string.length === 0) {
    return string;
  }
  return string[0].toLowerCase() + string.slice(1);
}

const headers = [
  {
    text: "required",
    value: "required"
  },
  {
    text: "prop",
    value: "prop"
  },
  {
    text: "localProp",
    value: "localProp"
  },
  {
    text: "type",
    value: "type"
  },
  {
    text: "default",
    value: "default"
  },

  {
    text: "watch",
    value: "watch"
  }
];

const typeDefaults: any = {
  String: `""`,
  Number: "0",
  Boolean: "false",
  Object: `() => {
    return {};
  }`,
  Array: `() => {
    return [];
  }`,
  Function: `() => {
    return function() {};
  }`,
  Promise: `() => {}`,
  Date: `() => {}`,
  Symbol: `() => {
    return Symbol();
  }`
};

const typeTS: any = {
  String: "string",
  Number: "number",
  Boolean: "boolean",
  Array: "Array",
  Function: "Function",
  Promise: "Promise",
  Date: "Date",
  Symbol: "Symbol"
};

const defaultType = ["String"];

export default Vue.extend({
  data() {
    return {
      snack: false,
      snackColor: "",
      snackText: "",
      max25chars: (v: any) => v.length <= 45 || "Input too long!",
      pagination: {},
      headers,
      desserts: Array.from(Array(20), () => {
        const a: any = {};
        headers.forEach(({ value }) => {
          a[value] = "";
        });
        return a;
      }),
      typeList: Object.keys(typeDefaults)
    };
  },
  methods: {
    save() {
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "Data saved";
    },
    cancel() {
      this.snack = true;
      this.snackColor = "error";
      this.snackText = "Canceled";
    },
    open() {
      this.snack = true;
      this.snackColor = "info";
      this.snackText = "Dialog opened";
    },
    close(field: string, item: IPropItem) {
      switch (field) {
        case "prop":
          item.localProp = `local${toUpperCase(item[field])}`;
          item.watch = `set${toUpperCase(item[field])}`;
          item.required = false;
          this.setItemType(defaultType, item);
          break;
        case "type":
          this.setItemType(item[field], item);
          break;
        default:
          break;
      }
    },
    setItemType(type: Array<string>, item: IPropItem) {
      if (type) {
        item.default = typeDefaults[type[0]];
      } else {
        item.default = ""; //typeDefaults[item[field]];
      }
    },
    exportTSCode() {
      const desserts = this.desserts.filter((item: IPropItem) => {
        return item.prop.trim().length;
      });
      const code =
        desserts
          .map((item: IPropItem) => {
            const type = item.type || ["String"];
            return `
        @Prop({
          type:${type.length > 1 ? "[" + type + "]" : type},
          default:${item.default},
          required:${item.required}
        })
        ${item.prop}!:${typeTS[type[0]]};
        @Watch("${item.prop}")
        ${item.watch}(value:${typeTS[type[0]]}){
          this.${item.localProp}=value
        }`;
          })
          .join("\n") +
        "\n\n" +
        desserts
          .map((item: IPropItem) => {
            const type = item.type || ["String"];
            return `${item.localProp}:${typeTS[type[0]]};`;
          })
          .join("\n") +
        "\n\n" +
        "mounted() {\n" +
        desserts
          .map((item: IPropItem) => {
            return `this.${item.watch}(this.${item.prop});`;
          })
          .join("\n") +
        "\n}";
      console.log(code);
    }
  }
});
</script>
