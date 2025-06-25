from openpyxl import load_workbook
#This code parses the xlsx document to a .dbc database

def convert_excel_to_dbc(excel_route, output_route):

    workbook = load_workbook(excel_route, data_only=True)
    dbc_file = open(output_route, "w")

    for worksheet in workbook:
        dbc_file.write(f"VERSION \"{worksheet.title}\"\n")        
        row = 5 #Messages types starts from this row
        message_id = 1
        message_id = worksheet["A" + str(row)].value
        while message_id:
            try:
                message_id = int(message_id)
                
                message_name = worksheet["B" + str(row)].value
                signals, total_bytes = get_byte_structure(worksheet, row)
               
                dbc_file.write(f"BO_ {message_id} {message_name}: {total_bytes} Vector__XXX\n")
                starting_bit = 0
                for signal in list(signals.keys())[::-1]:
                    if signal == '-':
                        break
                    units, safe_range = get_parameters(worksheet, signal)
                    if safe_range == "-":
                        safe_range = "[-100, 100]"
                    dbc_file.write(f"\tSG_ {signal} : {starting_bit*8}|{signals[signal]*8}@1+ (1,0) {safe_range.replace(',', '|')} \"{units}\" Vector__XXX\n")
                    starting_bit += signals[signal]
                
                dbc_file.write("\n")
            except Exception as e:
                print(e)
            finally:
                row += 1
                message_id = worksheet["A" + str(row)].value



    workbook.close()
    dbc_file.close()

def get_byte_structure(worksheet, row):
    actual_letter = 'C'
    total_bytes = 0
    signals = {} #dictionary -> signal_name : num_bytes
    last_signal_name = ""
    while actual_letter:
        try:
            byte_number = int(worksheet[actual_letter + "4"].value)
            signal_name = worksheet[actual_letter + str(row)].value
            if signal_name is None:
                signal_name = last_signal_name
            else:
                last_signal_name = signal_name
            
            signals[signal_name] = signals.get(signal_name, 0) + 1 # If signal_name is not in signals the method returns 0


            total_bytes += 1
            actual_letter = chr(ord(actual_letter) + 1)
        except:
            break

    return (signals, total_bytes)


def get_parameters(worksheet, signal):
    row = 5 #Messages types starts from this row  
    signal_name = worksheet[f"O{str(row)}"].value
    while signal_name != signal:
        row += 1
        signal_name = worksheet["O" + str(row)].value
    
    return (worksheet["Q" + str(row)].value, worksheet["R" + str(row)].value)


if __name__ == "__main__":
    convert_excel_to_dbc("can_prueba.xlsx", "test_can.dbc")



