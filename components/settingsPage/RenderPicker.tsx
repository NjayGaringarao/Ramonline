import { AffiliationType } from "@/constants/types";
import { Picker } from "@react-native-picker/picker";
import { View, Text } from "react-native";

interface IRenderPickerType {
  dimensions: AffiliationType;
  setDimensions: (dimensions: AffiliationType) => void;
}

interface RoleOptions {
  [key: string]: {
    departments?: { label: string; value: string | null }[];
    programs?: {
      [key: string]: { label: string; value: string | null }[];
    };
    years?: { label: string; value: string | null }[];
  };
}

const roleOptions: RoleOptions = {
  "Teaching Staff": {
    departments: [
      { label: "unset", value: null },
      { label: "CCIT", value: "CCIT" },
      { label: "CTE", value: "CTE" },
      { label: "CABA", value: "CABA" },
      { label: "HTHM", value: "HTHM" },
    ],
  },
  "Non-Teaching Staff": {
    departments: [
      { label: "unset", value: null },
      { label: "Maintenance", value: "Maintenance" },
      { label: "Administrative", value: "Administrative" },
      { label: "Security", value: "Security" },
    ],
    programs: {
      Administrative: [
        { label: "unset", value: null },
        { label: "Registrar", value: "Registrar" },
        { label: "Library", value: "Library" },
      ],
      Maintenance: [
        { label: "unset", value: null },
        { label: "Custodial", value: "Custodial" },
        { label: "Janitor", value: "Janitor" },
        { label: "Repairs", value: "Repairs" },
      ],
      Security: [
        { label: "unset", value: null },
        { label: "Campus Guards", value: "Campus Guards" },
        { label: "Monitoring", value: "Monitoring" },
      ],
    },
  },
  Student: {
    departments: [
      { label: "unset", value: null },
      { label: "CCIT", value: "CCIT" },
      { label: "CTE", value: "CTE" },
      { label: "CABA", value: "CABA" },
      { label: "HTHM", value: "HTHM" },
    ],
    programs: {
      CCIT: [
        { label: "unset", value: null },
        { label: "BSCS", value: "BSCS" },
        { label: "BSIT", value: "BSIT" },
      ],
      CTE: [
        { label: "unset", value: null },
        { label: "BEED", value: "BEED" },
        { label: "BSED - English", value: "BSED - English" },
        { label: "BSED - Science", value: "BSED - Science" },
        { label: "BSED - SocStud", value: "BSED - SocStud" },
      ],
      CABA: [
        { label: "unset", value: null },
        { label: "BSBA", value: "BSBA" },
        { label: "BSF", value: "BSF" },
      ],
      HTHM: [
        { label: "unset", value: null },
        { label: "BSHM", value: "BSHM" },
      ],
    },
    years: [
      { label: "unset", value: null },
      { label: "1st Year (Freshman)", value: "1" },
      { label: "2nd Year (Sophomore)", value: "2" },
      { label: "3rd Year (Junior)", value: "3" },
      { label: "4th Year (Senior)", value: "4" },
    ],
  },
};

const RenderPicker = ({ dimensions, setDimensions }: IRenderPickerType) => {
  const { first, second, third } = dimensions;

  return (
    <View className="space-y-2 pt-2">
      {/* Second Level Picker */}
      {first && roleOptions[first]?.departments && (
        <View>
          <Text className="text-uGray text-sm font-semibold">
            {first === "Student" || first === "Teaching Staff"
              ? "Department"
              : "Group"}
          </Text>
          <View className="h-9 rounded-lg justify-center bg-panel">
            <Picker
              selectedValue={second}
              onValueChange={(itemValue) =>
                setDimensions({
                  ...dimensions,
                  second: itemValue || null,
                  third: null,
                })
              }
              mode="dropdown"
            >
              {roleOptions[first].departments.map((option, index) => (
                <Picker.Item
                  key={index}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {/* Third Level Picker (Subcategories for Non-Teaching Staff) */}
      {first === "Non-Teaching Staff" &&
        second &&
        roleOptions["Non-Teaching Staff"].programs &&
        roleOptions["Non-Teaching Staff"].programs[second] && (
          <View>
            <Text className="text-uGray text-sm font-semibold">Role</Text>
            <View className="h-9 rounded-lg justify-center bg-panel">
              <Picker
                selectedValue={third}
                onValueChange={(itemValue) =>
                  setDimensions({
                    ...dimensions,
                    third: itemValue || null,
                  })
                }
                mode="dropdown"
              >
                {roleOptions["Non-Teaching Staff"].programs[second].map(
                  (option, index) => (
                    <Picker.Item
                      key={index}
                      label={option.label}
                      value={option.value}
                    />
                  )
                )}
              </Picker>
            </View>
          </View>
        )}

      {/* Third Level Picker (Programs for Students) */}
      {first === "Student" &&
        second &&
        roleOptions.Student.programs &&
        roleOptions.Student.programs[second] && (
          <View>
            <Text className="text-uGray text-sm font-semibold">Program</Text>
            <View className="h-9 rounded-lg justify-center bg-panel">
              <Picker
                selectedValue={third}
                onValueChange={(itemValue) =>
                  setDimensions({
                    ...dimensions,
                    third: itemValue || null,
                  })
                }
                mode="dropdown"
              >
                {roleOptions.Student.programs[second].map((option, index) => (
                  <Picker.Item
                    key={index}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
        )}

      {/* Fourth Level Picker (Year Level for Students) */}
      {first === "Student" && third && (
        <View>
          <Text className="text-uGray text-sm font-semibold">Year Level</Text>
          <View className="h-9 rounded-lg justify-center bg-panel">
            <Picker
              selectedValue={dimensions.year}
              onValueChange={(itemValue) =>
                setDimensions({ ...dimensions, year: itemValue || null })
              }
              mode="dropdown"
            >
              {roleOptions.Student.years &&
                roleOptions.Student.years.map((option, index) => (
                  <Picker.Item
                    key={index}
                    label={option.label}
                    value={option.value}
                  />
                ))}
            </Picker>
          </View>
        </View>
      )}
    </View>
  );
};

export default RenderPicker;
