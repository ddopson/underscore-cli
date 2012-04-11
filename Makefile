

####################################################################################################
## VARIABLES
####################################################################################################

# Variables - Commands
UNDERSCORE      ?= $(shell PATH=./bin:$$PATH which underscore)
ECHO            ?= echo  # MacOS compat: using abs path for 'echo' breaks. Alternatively, this gets fixed when using bash as the shell (vs 'sh')
ECHO_E          ?= $(ECHO) $(shell $(ECHO) -e foo | perl -ne '/^foo/ and print "-e"')

# Variables - Colors
GREEN           ?= \033[32m
YELLOW          ?= \033[38;5;226m
NOCOLOR         ?= \033[39;0m

####################################################################################################
## TARGETS
####################################################################################################

.PHONY: readme
readme:
	@$(ECHO_E) "$(YELLOW)Generating README.md from README.md.template$(NOCOLOR)"
	$(UNDERSCORE) --data null process '{usage: program.helpInformation()}' | $(UNDERSCORE) template README.md.template > README.md
