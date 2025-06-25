function StopButtonCB(evt) {
    console.log("STOPP!!!");
}

function changeHandlingModeCB(evt) {
    console.log("Change mode");
}

function TopBarView(props) {
    return (
        <div className="w-full flex items-center justify-between bg-[#00338D] px-8 py-5 text-white">
            {/* Logo y título */}
            <div className="flex items-center space-x-4 ml-15">
                <img
                    src="/src/assets/images/logo_talpa.svg"
                    alt="Talpa Tunneling UPV Logo"
                    className="h-16 w-auto"
                />
                <div>
                    <h1 className="text-2xl font-bold text-[#65B65A]">Talpa Tunneling UPV</h1>
                </div>
            </div>

            {/* Controles a la derecha */}
            <div className="flex items-center space-x-8">
                {/* Toggle Manual / Auto */}
                <div className="flex items-center space-x-4">
                    <span className="text-base">Manual</span>
                    <label className="inline-flex items-center cursor-pointer relative">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            onChange={changeHandlingModeCB}
                        />
                        <div className="w-14 h-7 bg-gray-300 peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                        <div className="absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full shadow-md transform peer-checked:translate-x-7 transition-transform"></div>
                    </label>
                    <span className="text-base">Automatic</span>
                </div>

                {/* STOP Button */}
                <button
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 text-lg rounded-full"
                    onClick={StopButtonCB}
                >
                    STOP
                </button>

                {/* Estado */}
                <div className="flex items-center space-x-3 mr-20">
                    <span className={`w-5 h-5 rounded-full ${props.isOnline ? "bg-green-700" : "bg-red-600"}`}></span>
                    <span className="text-base">{props.isOnline ? "Online" : "offline"}</span>
                </div>
            </div>
        </div>
    );
}

export default TopBarView;
