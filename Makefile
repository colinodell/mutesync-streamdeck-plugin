.PHONY: default
default: clean DistributionTool build

# Clean the Release folder
.PHONY: clean
clean:
	@rm -rf Release
	@mkdir -p Release

# Download and unzip the tool, if needed
DistributionTool:
	@curl https://developer.elgato.com/documentation/stream-deck/distributiontool/DistributionToolMac.zip -o DistributionTool.zip
	@unzip DistributionTool.zip DistributionTool
	@rm DistributionTool.zip

# Build the distribution
.PHONY: build
build:
	./DistributionTool -b -i Sources/com.colinodell.mutesync.sdPlugin -o Release
